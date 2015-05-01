namespace Web.Models
{
    public class Order
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public int Amount { get; set; }

        public int BeginHour { get; set; }

        public int EndHour { get; set; }
    }
}