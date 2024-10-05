output "github_actions_role_arn" {
  description = "The ARN of the role to be assumed by the GitHub Actions"
  value       = aws_iam_role.github_actions_role.arn
}

output "alb_dns_name" {
  description = "DNS name of ALB"
  value       = module.alb.alb_dns_name
}

output "ecr_repository_name" {
  description = "The name of the ECR Repository"
  value       = module.ecr.repository_name
}