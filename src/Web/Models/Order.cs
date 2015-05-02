namespace Web.Models
{
    public class Order
    {
        public Point Coords { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public int Amount { get; set; }

        public int OpenHour { get; set; }
    }
}