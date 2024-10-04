resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda_${var.name_alias}" // TODO
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_openid_connect_provider" "github_actions_oidc" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]

  /*tags = {
    Namespace = var.namespace
    Stage     = var.stage
    Name      = var.name
  }*/
}

resource "aws_iam_role" "github_actions_role" {
  name = "github_actions"

  // TODO: move out
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
            // TODO: up this
          }
            "token.actions.githubusercontent.com:sub" : "repo:vladbogdan10/deploy-web-app-on-aws-with-terraform-and-github-actions:*"
          },
          StringEquals = {
            "token.actions.githubusercontent.com:aud" : "sts.amazonaws.com"
          }
        }
      }
    ]
  })