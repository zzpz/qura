resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  enable_dns_hostnames = true

  tags = {
    Name = "main"
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.main.id

  tags = {
    "Name" = "main gateway"
  }
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "Main"
  }
}

resource "aws_route_table" "public_route_table" {

  vpc_id = aws_vpc.main.id
  route {
    gateway_id = aws_internet_gateway.gateway.id
    cidr_block = "0.0.0.0/0"
  }

  tags = {
    "Name" = "public route table"
  }

}

# Associate Public Subnet to Public Route Table
resource "aws_route_table_association" "public_subnet_route_table_assoc" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.public_route_table.id
}


resource "aws_security_group" "allow_ssh" {
  description = "Allow ssh traffic for instance"

  vpc_id = aws_vpc.main.id

  ingress {
    description      = "SSH inbound"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description      = "all out"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "allow_http" {
  description = "Allow inbound HTTP traffic for instance on port 80-8000"
  vpc_id      = aws_vpc.main.id

  ingress {
    description      = "http in"
    from_port        = 80
    to_port          = 8000 # fastapi is port 8000 we opened ports 80 through 8k
    protocol         = "TCP"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description      = "all out"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]

  }
}