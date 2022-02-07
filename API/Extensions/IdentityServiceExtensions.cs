using System.Text;
using Core.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            var builder = services.AddIdentityCore<AppUser>();//.AddRoles<AppRole>();

            builder = new IdentityBuilder(builder.UserType, builder.Services);//.AddRoleValidator<RoleValidator<AppRole>>();
            builder.AddEntityFrameworkStores<AppIdentityDbContext>();//adds the default identity services
            builder.AddSignInManager<SignInManager<AppUser>>();//adds the default sign in manager
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(op => 
            {
                op.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true, //validate the key
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                        config.GetSection("Token:Key").Value)),//the key  config["Token:Key"]
                    ValidIssuer =  config.GetSection("Token:Issuer").Value,//the issuer
                    ValidateIssuer = true,//validate the issuer
                    ValidateAudience = false,//validate the audience
                };
            });//add authentication
         
            return services;
        }
    }
}