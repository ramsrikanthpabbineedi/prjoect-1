terraform {
  backend "s3" {
    bucket = "ram-sri-bucket"
    key    = "ram/ra/terraform.tfstate"
    region = "eu-north-1"

  }
}