﻿    public class Link
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }  
        public User User { get; set; }    
    }