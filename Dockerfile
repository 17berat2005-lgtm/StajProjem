FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["restorant projem/restorant projem.csproj", "restorant projem/"]
RUN dotnet restore "restorant projem/restorant projem.csproj"

COPY . .
WORKDIR "/src/restorant projem"
RUN dotnet publish "restorant projem.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "restorant projem.dll"]

