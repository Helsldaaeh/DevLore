using Microsoft.AspNetCore.Mvc;

namespace DevLore.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
