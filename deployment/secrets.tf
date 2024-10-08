data "aws_secretsmanager_secret" "secrets" {
  name = "connections/database_url"
}

data "aws_secretsmanager_secret_version" "database_url" {
  secret_id = data.aws_secretsmanager_secret.secrets.id
}