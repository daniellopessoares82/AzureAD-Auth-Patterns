using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace azureAD.auth.patterns.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpGet("validate")]
        [Authorize]
        public IActionResult Validate()
        {
            var user = HttpContext.User;
            if (user?.Identity?.IsAuthenticated != true)
            {
                return Unauthorized(new { message = "Token inválido ou não autenticado." });
            }

            var claims = user.Claims.Select(c => new { type = c.Type, value = c.Value });

            return Ok(new
            {
                message = "Token válido.",
                valid = true,
                name = user.Identity?.Name,
                subject = user.FindFirst("sub")?.Value,
                oid = user.FindFirst("oid")?.Value,
                claims
            });
        }
    }
}