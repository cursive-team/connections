data "aws_caller_identity" "current" {}

# token is needed for our local docker demeon to connect to aws ecr
data "aws_ecr_authorization_token" "token" {}

// TODO: ypdate to the correct policy

# lambda policy_document
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole" ]
  }
}

# lambda cloudwatch_policy_document
data "aws_iam_policy_document" "cloudwatch_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]  // Allows access to all CloudWatch Logs resources
  }
}