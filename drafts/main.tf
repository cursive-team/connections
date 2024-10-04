# create ecr repository
resource "aws_ecr_repository" "cursive-connections" {
  name                 = "${var.name_alias}"
  image_tag_mutability = "MUTABLE"
}

# Specifying Docker provider

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

# Define the Docker container data source
data "docker_image" "local_image" {
  name = "pure_image"
}

# Define the Docker container resource
resource "docker_container" "pure_app" {
  name  = "pure_app"
  image = data.docker_image.local_image.name
  # Expose port 5000 for Flask app
  ports {
    internal = 5000
    external = 5000
  }
}

# Terraform provisioner to wait for container to be ready
resource "null_resource" "wait_for_container" {
  depends_on = [docker_container.pure_app]
  # Local-exec provisioner to wait for container to be ready
  provisioner "local-exec" {
    command = "sleep 10"
  }
}