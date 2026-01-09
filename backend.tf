terraform {
  backend "s3" {
    bucket = "rqaebiaugfduae"
    key    = "ram/ra/terraform.tfstate"
    region = "eu-north-1"

  }
}