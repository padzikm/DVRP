namespace Web.Models
{
    public class Depot
    {
        public string Address { get; set; }

        public int TruckCount { get; set; }

        public int TruckLoad { get; set; }

        public int BeginHour { get; set; }

        public int EndHour { get; set; }
    }
}