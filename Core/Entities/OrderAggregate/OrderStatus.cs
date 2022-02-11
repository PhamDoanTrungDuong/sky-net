using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Payment Received")]
        PaymentReceived,
        [EnumMember(Value = "payment Failed")]
        PaymentFailed,
        [EnumMember(Value = "Shipped")]
        Shipped,
        [EnumMember(Value = "Canclled")]
        Cancelled

    }
}