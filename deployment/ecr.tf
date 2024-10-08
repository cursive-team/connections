module "ecr" {
  source  = "cloudposse/ecr/aws"
  version = "0.35.0"


  namespace = var.namespace
  # stage     = var.stage
  name      = var.name

  max_image_count         = 100
  protected_tags          = ["latest"]
  image_tag_mutability    = "MUTABLE"
  enable_lifecycle_policy = true

  # Whether to delete the repository even if it contains images
  force_delete = true
}

resource "aws_iam_openid_connect_provider" "github_actions_oidc" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]

  tags = {
    Namespace = var.namespace
    # Stage     = var.stage
    Name      = var.name
  }
}

resource "aws_iam_role" "github_actions_role" {
  name = "github_actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github_actions_oidc.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringLike = {
            # TODO: if this works, then scope to specific repo:
            # "token.actions.githubusercontent.com:sub" : "repo:${var.namespace}/${var.name}"
            "token.actions.githubusercontent.com:sub" : "repo:${var.namespace}/*"
          },
          StringEquals = {
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  # TODO: once it works, minimize scope
  managed_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]

  tags = {
    Namespace = var.namespace
    # Stage     = var.stage
    Name      = var.name
  }
}