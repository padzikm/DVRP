using System.Collections.Generic;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Compute(Depot depot, IEnumerable<Order> orders)
        {
            return Json("ok");
        }
    }
}