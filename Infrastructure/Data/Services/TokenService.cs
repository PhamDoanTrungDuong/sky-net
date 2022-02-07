using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System;

namespace Infrastructure.Data.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));//the key

        }

        public string CreateToken(AppUser user)
        {
            var claim = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.DisplayName),
            };//add claims

            var cred = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);//signing credentials
 
            var tokenDesctiptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claim),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = cred,
                Issuer = _config["Token:Issuer"]
            };//create token descriptor

            var tokenHandler = new JwtSecurityTokenHandler();//create token handler

            var token = tokenHandler.CreateToken(tokenDesctiptor);//create token

            return tokenHandler.WriteToken(token);//write token
        }
    }
}