namespace Web.Models
{
    public class Depot
    {
        public Point Coords { get; set; }

        public string Address { get; set; }

        public int TruckCount { get; set; }

        public int TruckLoad { get; set; }

        public string OpenTime { get; set; }

        public string CloseTime { get; set; }
    }
}