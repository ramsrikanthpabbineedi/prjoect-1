provider "aws" {
  region = var.aws_region

}
resource "aws_vpc" "vps-1" {
  cidr_block = var.vpc_cidr
  tags = {
    name = var.vpc_name
  }

}
resource "aws_subnet" "subnet-1" {
  vpc_id     = aws_vpc.vps-1.id
  cidr_block = var.sub-1_cidr
  tags = {
    name = var.sub-1_name
  }

}
resource "aws_subnet" "subnet-2" {
  vpc_id     = aws_vpc.vps-1.id
  cidr_block = var.sub-2_cidr
  tags = {
    name = var.sub-2_name
  }

}
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vps-1.id
  tags = {
    name = var.igw_name
  }

}
resource "aws_default_route_table" "rtb" {
  default_route_table_id = aws_vpc.vps-1.default_route_table_id
  tags = {
    name = var.rtb_name
  }

}
resource "aws_route_table_association" "association-1" {
  route_table_id = aws_default_route_table.rtb.id
  subnet_id      = aws_subnet.subnet-1.id


}
resource "aws_route_table_association" "association-2" {
  route_table_id = aws_default_route_table.rtb.id
  subnet_id      = aws_subnet.subnet-2.id

}
resource "aws_default_route_table" "igw" {
  default_route_table_id = aws_vpc.vps-1.default_route_table_id
  route {
    cidr_block = "0,0,0,0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

}
resource "aws_security_group" "security-1" {
  vpc_id = aws_vpc.vps-1.id
  ingress {
    from_port = 80
    to_port   = 80
    protocol  = "tcp"

  }
  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
  }
  tags = {
    name = var.security_name
  }

}
resource "aws_vpc_endpoint" "ec2" {
  vpc_id             = aws_vpc.vps-1.id
  vpc_endpoint_type  = "interface"
  service_name       = "com.amazonaws.eu-north-1.ec2messages"
  subnet_ids         = [aws_subnet.subnet-1.id]
  security_group_ids = [aws_security_group.security-1.id]
  tags = {
    name = var.end_ec2
  }
}

resource "aws_vpc_endpoint" "ssmmessager" {
  vpc_id             = aws_vpc.vps-1.id
  vpc_endpoint_type  = "interface"
  service_name       = "com.amazonaws.eu-north-1.ssmmessages"
  subnet_ids         = [aws_subnet.subnet-1.id]
  security_group_ids = [aws_security_group.security-1.id]
  tags = {
    name = var.end_ssmmsg
  }
}
resource "aws_vpc_endpoint" "ssm" {
  vpc_id             = aws_vpc.vps-1.id
  vpc_endpoint_type  = "interface"
  service_name       = "com.amazonaws.eu-north-1.ssm"
  subnet_ids         = [aws_subnet.subnet-1.id]
  security_group_ids = [aws_security_group.security-1.id]
  tags = {
    name = var.end_ssm
  }
}
resource "aws_key_pair" "jenkins_key" {
  key_name   = "jenkins-key"
  public_key = file("keys/jenkins-ec2-key.pub")
}
resource "aws_iam_role" "role" {

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
  tags = {
    Name = var.iam_role
  }

}
resource "aws_iam_role_policy_attachment" "name" {
  role       = aws_iam_role.role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
resource "aws_iam_instance_profile" "p" {
  role = aws_iam_role.role.name
  tags = {
    name = var.policy_name
  }
}
resource "aws_instance" "ec2_instance" {
  instance_type               = "t3.small"
  ami                         = "ami-0fa91bc90632c73c9"
  subnet_id                   = aws_subnet.subnet-1.id
  vpc_security_group_ids      = [aws_security_group.security-1.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.jenkins_key.key_name
  iam_instance_profile        = aws_iam_instance_profile.p.id
  user_data                   = <<-EOF
  #!/bin/bash
sudo apt update -y
sudo apt install -y amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent

EOF

}