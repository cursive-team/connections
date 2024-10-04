resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16" // HERE: should this be somethign else?
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "EC2 + Docker VPC" // TODO: update
  }
}

resource "aws_eip" "my_app" {
  instance = aws_instance.my_app.id
  vpc      = true
}

resource "aws_subnet" "express-test" {
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 3, 1)
  vpc_id            = aws_vpc.main.id
  availability_zone = var.availability_zone
}

// This will allow traffic from our internet gateway (which we haven’t created yet) to reach our VPC -- may change to ALB in the future
resource "aws_route_table" "my_app" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.express-test.id # This will be created when we apply our configuration.
  }

  tags = {
    Name = "express-test"
  }
}

resource "aws_route_table_association" "subnet-association" {
  subnet_id      = aws_subnet.express-test.id
  route_table_id = aws_route_table.my_app.id
}

resource "aws_internet_gateway" "express-test" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "express-test"
  }
}