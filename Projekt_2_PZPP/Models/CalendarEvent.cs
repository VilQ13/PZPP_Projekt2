using System;
using System.ComponentModel.DataAnnotations;

public class CalendarEvent
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; }

    public DateTime Start { get; set; }

    public DateTime? End { get; set; }

    public bool AllDay { get; set; }

    public string BackgroundColor { get; set; }

    public string BorderColor { get; set; }

    public string Description { get; set; }

    
    public Guid UserId { get; set; }
}
