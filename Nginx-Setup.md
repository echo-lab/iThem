# How to set up self-hosted server for nodejs/nextjs app

## summary
to set up the app involves:
1. set up nginx and its reverse proxy
    reverse proxy allows requests to be redirected to your app at localhost
    for instance, in this project ithem.cs.vt.edu, we use nginx to redirect request to ithem.cs.vt.edu to localhost:3000.
    there's a few different ways to run nginx and they all works I just used `sudo systemctl start nginx`.
    Note you can not run two nginx at the same time and if you do the second nginx process will give error that there's already a process listening on port 80 (the default port for http request)

    the key to reverse proxy is to edit conf file. You can create conf file or edit the default file.
    The one I edited is `nginx.conf` in the /etc/nginx folder (ithem.cs.vt.edu server OS: CentOS)
    You would also need sudo access.

    There will be two server section by default, one for port 80 and one for port 443. 
    Go into the first one and edit server_name to your host address.
    Then add a section called location and add a option named proxy_pass with your localhost address. 

    My conf file looks like this:
    ``
    ...
    server {
    if ($host = ithem.cs.vt.edu) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    listen       80;
    listen       [::]:80 ipv6only=on default_server;
    server_name  ithem.cs.vt.edu;
    root         /usr/share/nginx/html;
    location / {
    proxy_pass  http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    }
     (Load configuration files for the default server block.)
    include /etc/nginx/default.d/*.conf;
    ...
    ``
    There's a lot of other stuff in this conf file but you dont need to edit them. Once you finish change the server_name and proxy_pass, save it and restart the nginx service and it will be working. `sudo systemctl restart nginx`

    By the way you can also write some of the settings in a separate conf file and use include if you desire. 

2. have your app running on localhost:3000.
    This can be as simple as npm run dev and use screen to run it on backend.
    As I research into this setup, some recommend use pm2 to manage process. 
    It is not essential to have pm2. As long as the app is running on localhost, browers can access it via nginx.
    (https://dev.to/reactstockholm/setup-a-next-js-project-with-pm2-nginx-and-yarn-on-ubuntu-18-04-22c9)

3. set up https for google auth. 
    google auth requires https.
    note: https and http is two separate settings. http is on port 80, which is the default port that nginx will enabled and you will set up first. https is on port 430, and enabled it requires SSL certicates. Now there's tutorials about create self-signed certificates for enabling https(https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04). But you should know that browser will still block it because it is not signed by Certificate Authority and browsers can thus not able to verify it. 

    The easist way I found to enable https is use Free Let’s Encrypt SSL/TLS Certificates (certbot). 
    As I tested it I found that cerbot also automatically update your nginx conf file so you dont need to manually edit it. 
    Here's a tutorial for use certbot that worked for me(https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/). 

    Basically: `sudo yum install certbot python3-certbot-nginx` and `sudo certbot --nginx -d ithem.cs.vt.edu`
    That's all you need for set up https (I know it's sounds too good to be true). 

    Additionally you might also want to set up auto renew as Let’s Encrypt certificates expire after 90 days.
    run command `crontab -e` and add `0 12 * * * /usr/bin/certbot renew --quiet` and save it. All installed certificates will be automatically renewed and reloaded.
    


## Resources:
nginx documentation: http://nginx.org/en/docs/beginners_guide.html
nginx conf file doc: http://nginx.org/en/docs/http/configuring_https_servers.html

https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04
