FROM openjdk:17.0.1-jdk-slim
EXPOSE 8080
ARG JAR_FILE=target/*SNAPSHOT.jar
WORKDIR /opt/backend
COPY ${JAR_FILE} backend.jar
ENTRYPOINT ["java", "-jar", "backend.jar"]