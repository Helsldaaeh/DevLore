FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER app
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
# EXPOSE 8081  # если не нужен https, можно убрать

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DevLore/DevLore.csproj", "DevLore/"]
RUN dotnet restore "./DevLore/DevLore.csproj"
COPY . .
WORKDIR "/src/DevLore"
RUN dotnet build "./DevLore.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DevLore.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DevLore.dll"]