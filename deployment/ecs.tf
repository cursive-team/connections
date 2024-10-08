module "cloudwatch_logs" {
  source  = "cloudposse/cloudwatch-logs/aws"
  version = "0.6.6"

  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  retention_in_days = 7
}

module "container_definition" {
  source  = "cloudposse/ecs-container-definition/aws"
  version = "0.58.1"

  # container_name = "${var.namespace}-${var.stage}-${var.name}"
  container_name   = "${var.namespace}-${var.name}"
  container_image  = "${module.ecr.repository_url}:${var.image_tag}"
  container_memory = 512 # optional for FARGATE launch type
  container_cpu    = 256 # optional for FARGATE launch type
  essential        = true
  port_mappings    = var.container_port_mappings

  # The environment variables to pass to the container.
  environment = [
    {
      name  = "DATABASE_URL"
      # Leveraging the permissions of the role which applies the changes, which is admin, rather than the container
      value = jsondecode(data.aws_secretsmanager_secret_version.database_url.secret_string)["SECRET_DATABASE_URL"]
    },
  ]

  # Pull secrets from AWS Parameter Store.
  # "name" is the name of the env var.
  # "valueFrom" is the name of the secret in PS.
  #secrets = [
  #   {
  #     name      = "DATABASE_URL"
  #     valueFrom = "arn:aws:secretsmanager:${var.region}:${var.aws_account_number}:secret:connections/$name
  #   },
  #]

  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-region"        = var.region
      "awslogs-group"         = module.cloudwatch_logs.log_group_name
      "awslogs-stream-prefix" = var.name
    }
    secretOptions = null
  }
}

resource "aws_ecs_cluster" "ecs_cluster" {
  # name = "${var.namespace}-${var.stage}-${var.name}"
  name = "${var.namespace}-${var.name}"
  tags = {
    Namespace = var.namespace
    # Stage     = var.stage
    Name      = var.name
  }
}

module "ecs_alb_service_task" {
  source  = "cloudposse/ecs-alb-service-task/aws"
  version = "0.66.4"

  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  use_alb_security_group         = true
  alb_security_group             = module.alb.security_group_id
  container_definition_json      = module.container_definition.json_map_encoded_list
  ecs_cluster_arn                = aws_ecs_cluster.ecs_cluster.arn
  launch_type                    = "FARGATE"
  vpc_id                         = module.vpc.vpc_id
  security_group_ids             = [module.vpc.vpc_default_security_group_id]
  subnet_ids                     = module.subnets.private_subnet_ids # change to "module.subnets.public_subnet_ids" if "nat_gateway_enabled" is false
  ignore_changes_task_definition = false
  network_mode                   = "awsvpc"
  assign_public_ip               = false # change to true if "nat_gateway_enabled" is false
  propagate_tags                 = "TASK_DEFINITION"
  desired_count                  = var.desired_count
  task_memory                    = 512
  task_cpu                       = 256
  force_new_deployment           = true
  container_port                 = var.container_port_mappings[0].containerPort

  ecs_load_balancers = [{
    # container_name   = "${var.namespace}-${var.stage}-${var.name}"
    container_name   = "${var.namespace}-${var.name}"
    container_port   = var.container_port_mappings[0].containerPort
    elb_name         = ""
    target_group_arn = module.alb.default_target_group_arn
  }]
}