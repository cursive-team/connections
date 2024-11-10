# Self-hosted NTAG424 Tap Validator

## Instance setup

Instructions for an Ubuntu instance on AWS. Need to set security group such that you can have Custom TCP access on 0.0.0.0 and port 9091 so the validator can be accessed from open internet.

1. Need to download the tgz file for the ARX validator service
2. Send tgz file to your machine with `scp -i machine.pem ../n424-validator/arx_n424_validator.tgz ubuntu@{public_instance_url}:~/`
3. Unzip with `tar -xzvf arx_n424_validator.tgz`
4. Rename and move with `mv dist/arx_n424_validator_x64linux ./arx_n424_validator`
5. Set up .env with `./arx_n424_validator sample-env > .env`
6. Replace `SDM_SECRET_KEY_1` with the correct secret key
7. Uncomment `MUTUAL_AUTH_API_TOKEN` and `TICKET_CHECK_TOKEN` in the .env
8. Note down the `SDM_AUTH_TOKEN`, you'll need that for authorizing API requests
9. Copy `setup_and_run.sh` file in `/home/ubuntu/` or `~`
10. Make script executable `sudo chmod +x /home/ubuntu/setup_and_run.sh`
11. Copy systemd service file `arx-validator.service` in `/etc/systemd/system/`
12. Reload systemd manager to read new service file `sudo systemctl daemon-reload`
13. Enable service to start on boot `sudo systemctl enable arx-validator.service`
14. Start service with `sudo systemctl start arx-validator.service`

You can check status with `sudo systemctl status arx-validator.service` and view logs with `sudo journalctl -u arx-validator.service`. You should be able to visit the public URL with HTTP on port 9091 and see a webpage to test URLs.

## Using the validator API

Hit the API endpoint with a GET request to `{public_instance_url}:9091/api/validate?e={dynamic_url}` using headers `Authorization: Bearer ${SDM_AUTH_TOKEN}` from step 7. View `apps/backend/src/lib/controller/chip/managed/util.ts` for an example.
