docker network create platform-net

docker-compose -p platform.local -f database.yml up -d

docker-compose -p platform.local -f aac.yml up -d

docker-compose -p platform.local -f apim.yml up -d
