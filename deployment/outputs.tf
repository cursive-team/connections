output "github_actions_role_arn" {
  description = "The ARN of the role to be assumed by the GitHub Actions (add to Github Secrets)"
  value       = aws_iam_role.github_actions_role.arn
}

output "alb_dns_name" {
  description = "DNS name of ALB (add as CNAME in cursive.team name DNS records)"
  value       = module.alb.alb_dns_name
}

output "nat_gateway_ip" {
  description = "The static ip of the NAT gateway (add the $ip:5432 to inbound rules of RDS's security group to allow backend to communicate with the DB)"
  value = module.subnets.nat_gateway_public_ips
}

output "ecr_repository_name" {
  description = "The name of the ECR Repository"
  value       = module.ecr.repository_name
}