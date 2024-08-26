using System.ComponentModel.DataAnnotations;

namespace Excel_Backend.Models;
class UserDataWithRows
{
    [Key]
    public string? Email { get; set; }

    public string? Name { get; set; }

    public string? Country { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public string? TelephoneNumber { get; set; }

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? DOB { get; set; }

    public uint? FY2019_20 { get; set; }

    public uint? FY2020_21 { get; set; }

    public uint? FY2021_22 { get; set; }

    public uint? FY2022_23 { get; set; }

    public uint? FY2023_24 { get; set; }

    public uint? rownum { get; set; }
}