FROM ubuntu:xenial
LABEL AUTHOR Yieldpoint

RUN apt update && apt -y upgrade && DEBIAN_FRONTEND=noninteractive apt -y install curl git ruby ruby-dev

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
#RUN apt-get install -y nodejs

RUN DEBIAN_FRONTEND=noninteractive apt -y install build-essential nodejs

RUN gem install sass compass

RUN npm install -g bower
RUN npm install -g ember-cli

# Move GDP to apache core directory
ADD ./ /geotechnical-data-platform-web

# RUN cd /geotechnical-data-platform-web
WORKDIR "/geotechnical-data-platform-web"

# Install ember packages
RUN npm install
RUN bower --allow-root install
RUN ember build

# -------------------------------------------------------------
# Create a master image based on artifacts from EmberJS compile
# -------------------------------------------------------------

FROM ubuntu:xenial

COPY --from=0 /geotechnical-data-platform-web/dist /var/www/html

# Manually set up the apache environment variables
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid

ENV API_URL http://localhost:8000
#ENV API_URL https://localhost:8443

RUN apt update && apt -y upgrade && DEBIAN_FRONTEND=noninteractive apt -y install \
    apache2 gridsite-clients curl gridsite-clients
    # vim htop mc

# Enable apache mods.
RUN a2enmod rewrite
RUN a2enmod ssl

# Update the default apache site with the config we created.
ADD Docker/apache/apache.conf /etc/apache2/sites-enabled/000-default.conf
#ADD Docker/apache/apache-https.ssl.conf /etc/apache2/sites-enabled/000-default.conf

# Expose apache
EXPOSE 80
EXPOSE 443

# Temporary basic authentication on GDP front-end
RUN echo 'yieldpoint:$apr1$/sqAFMML$LmIduR7j8tXr7cxyfNzVE/' >> /etc/apache2/.htpasswd

# By default start up apache in the foreground, override with /bin/bash for interative.
ADD Docker/entrypoint.sh /opt/entrypoint.sh

CMD /opt/entrypoint.sh