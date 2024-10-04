variable "aws_region" {
  type        = string
  default     = "ap-southeast-1" // Singapore
  description = "aws region for current resource"
}

variable "aws_account_number" {
  type        = string
  description = "AWS account number"
}

variable "namespace" {
  type        = string
  default     = "cursive"
  description = "Usually an abbreviation of your organization name, e.g. 'eg' or 'cp'"
}

variable "name" {
  type        = string
  default     = "connections"
  description = "Project name"
}

# If we decide to have a staging vs production environment this will be relevant.
variable "stage" {
  type        = string
  default     = "prod"
  description = "Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release'"
}