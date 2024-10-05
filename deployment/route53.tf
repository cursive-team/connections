
locals {
  domain_name = "demo.hands-on-cloud.com"
  alt_name    = ["*.demo.hands-on-cloud.com"]
}
resource "aws_acm_certificate" "my_domain" {
  domain_name               = local.domain_name
  subject_alternative_names = local.alt_name
  validation_method         = "DNS"
  tags = {
    Environment = "test"
  }
  lifecycle {
    create_before_destroy = true
  }
}
data "aws_route53_zone" "my_domain" {
  name         = local.domain_name
  private_zone = false
}
resource "aws_route53_record" "my_domain" {
  for_each = {
    for dvo in aws_acm_certificate.my_domain.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.my_domain.zone_id
}
resource "aws_acm_certificate_validation" "my_domain" {
  certificate_arn         = aws_acm_certificate.my_domain.arn
  validation_record_fqdns = [for record in aws_route53_record.my_domain : record.fqdn]
}

resource "aws_route53_zone" "backend" {
  name = "api.connections.cursive.team"
}

// cursive-team-connections.ap-southeast-1.elb.amazonaws.com
resource "aws_route53_record" "point_to_alb" {
  allow_overwrite = true
  zone_id = aws_route53_zone.backend.zone_id
  name    = "api.connections.cursive.team"
  type    = "CNAME"
  ttl     = 300
  records = [module.alb.alb_dns_name]
}