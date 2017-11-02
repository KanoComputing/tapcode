{
    "variable": {
        "domain_name": {
            "default": "tapcode",
            "description": "production environment for the tapcode domain name"
        }
    },
    "terraform": {
        "backend": {
            "s3": {
                "bucket": "terraform.kano",
                "key": "tapcode/terraform.tfstate",
                "region": "eu-west-1"
            }
        }
    },
    "provider": {
        "aws": {
            "region": "us-west-1"
        }
    },
    "resource": {
        "aws_s3_bucket": {
            "tapcode": {
                "bucket": "${var.domain_name}.kano.me",
                "force_destroy": true,
                "acl": "public-read",
                "policy": "${file(\"policy.json\")}",
                "cors_rule": {
                    "allowed_headers": ["*"],
                    "allowed_methods": ["GET"],
                    "allowed_origins": ["https://*.kano.me", "http://localhost:*", "http://127.0.0.1:*"],
                    "expose_headers": ["ETag"],
                    "max_age_seconds": 86400
                },
                "website": {
                    "index_document": "index.html"
                }
            }
        },
        "aws_cloudfront_distribution": {
            "tapcode": {
                "origin": {
                    "domain_name": "${aws_s3_bucket.tapcode.bucket_domain_name}",
                    "origin_id": "${var.domain_name}"
                },
                "aliases": ["${aws_s3_bucket.tapcode.bucket}"],
                "enabled": true,
                "is_ipv6_enabled": true,
                "comment": "${var.domain_name} edge caching",
                "default_root_object": "index.html",
                "default_cache_behavior": {
                    "compress": true,
                    "allowed_methods": ["HEAD", "GET", "OPTIONS"],
                    "cached_methods": ["HEAD", "GET", "OPTIONS"],
                    "target_origin_id": "${var.domain_name}",
                    "viewer_protocol_policy": "allow-all",
                    "min_ttl": 0,
                    "default_ttl": 3600,
                    "max_ttl": 86400,
                    "forwarded_values": {
                        "query_string": false,
                        "cookies": {
                            "forward": "none"
                        },
                        "headers": ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
                    }
                },
                "viewer_certificate": {
                    "iam_certificate_id": "ASCAJXMICN5PIG23H7L76",
                    "ssl_support_method": "sni-only",
                    "minimum_protocol_version": "TLSv1"
                },
                "restrictions": {
                    "geo_restriction": {
                        "restriction_type": "none"
                    }
                }
            }
        },
        "aws_route53_record": {
            "tapcode": {
                "zone_id": "Z3CJAAJCKXZI0S",
                "name": "${var.domain_name}",
                "type": "CNAME",
                "ttl": 300,
                "records": ["${aws_cloudfront_distribution.tapcode.domain_name}"]
            }
        },
        "aws_dynamodb_table": {
            "basic-dynamodb-table": {
                "name": "tapcode",
                "read_capacity": 5,
                "write_capacity": 5,
                "hash_key": "id",
                "attribute": {
                    "name": "id",
                    "type": "S"
                }
            }
        }
    }
}
