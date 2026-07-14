# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy sources and package
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Port is dynamic on Railway but default metadata EXPOSE is good practice
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "-Dfile.encoding=UTF-8", "app.jar"]
