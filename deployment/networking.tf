module "vpc" {
  source  = "cloudposse/vpc/aws"
  version = "2.0.0"

  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  ipv4_primary_cidr_block = "10.0.0.0/16"
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  version = "2.0.4"

  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  availability_zones  = ["ap-southeast-1a", "ap-southeast-1b", "ap-southeast-1c"] # change to your AZs
  vpc_id              = module.vpc.vpc_id
  igw_id              = [module.vpc.igw_id]
  ipv4_cidr_block     = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled = true
  max_nats            = 1
}

module "alb" {
  source  = "cloudposse/alb/aws"
  version = "1.7.0"

  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  access_logs_enabled   = false
  vpc_id                = module.vpc.vpc_id
  ip_address_type       = "ipv4"
  subnet_ids            = module.subnets.public_subnet_ids
  security_group_ids    = [module.vpc.vpc_default_security_group_id]
  # https_enabled         = true
  # certificate_arn       = aws_acm_certificate.cert.arn
  # http_redirect         = true
  health_check_interval = 60
}
