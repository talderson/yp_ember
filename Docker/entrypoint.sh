#!/bin/sh

# Set a default api url
#API_URL=${API_URL:-"http://localhost:8000"}
API_URL=${API_URL:-"http://192.168.0.65:8000"}
API_CREDENTIALS=${API_CREDENTIALS:-"eWllbGRwb2ludDpZUGZ1dHVyZQ=="}

# Update the api url if it is specified
if [ "$API_URL" != "" ]; then
    ENCODED_API_URL=$(urlencode $API_URL)
    sed -i 's@API_URL%22%3A%22[^P]*%22%2C@API_URL%22%3A%22'$ENCODED_API_URL'%22%2C@g' /var/www/html/index.html
fi

# Update the api credentials if it is specified
if [ "$API_CREDENTIALS" != "" ]; then
    ENCODED_API_CREDENTIALS=$(urlencode $API_CREDENTIALS)
    sed -i 's@API_CREDENTIALS%22%3A%22[^P]*%22%2C@API_CREDENTIALS%22%3A%22'$ENCODED_API_CREDENTIALS'%22%2C@g' /var/www/html/index.html
fi

rm -f /var/run/apache2/apache2.pid

# By default start up apache in the foreground, override with /bin/bash for interative.
exec /usr/sbin/apache2ctl -D FOREGROUND
