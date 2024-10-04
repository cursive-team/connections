output "github_actions_role_arn" {
  description = "The ARN of the role to be assumed by the GitHub Actions"
  value       = aws_iam_role.github_actions_role.arn
}