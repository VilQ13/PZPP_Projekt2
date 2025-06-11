using System;
using System.ComponentModel.DataAnnotations;

public class Todo
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Text { get; set; }

    public bool IsCompleted { get; set; } = false;

    public Guid UserId { get; set; } 
}
