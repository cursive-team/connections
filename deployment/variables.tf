variable "region" {
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

variable "image_tag" {
  type        = string
  default     = "latest"
  description = "Docker image tag"
}

variable "container_port_mappings" {
  type = list(object({
    containerPort = number
    hostPort      = number
    protocol      = string
  }))
  default = [
    {
      containerPort = 8080
      hostPort      = 8080
      protocol      = "tcp"
    }
  ]
  description = "The port mappings to configure for the container. This is a list of maps. Each map should contain \"containerPort\", \"hostPort\", and \"protocol\", where \"protocol\" is one of \"tcp\" or \"udp\". If using containers in a task with the awsvpc or host network mode, the hostPort can either be left blank or set to the same value as the containerPort"
}

variable "desired_count" {
  type        = number
  description = "The number of instances of the task definition to place and keep running"
  default     = 1
}