using System;
using System.ComponentModel.DataAnnotations;

namespace Projekt_2_PZPP.Models
{
    public class StickyNote
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string BackgroundColor { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid UserId { get; set; }
    }
}
