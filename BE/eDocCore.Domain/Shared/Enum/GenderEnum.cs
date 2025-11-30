using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eDocCore.Domain.Shared.Enum
{
    public enum GenderEnum
    {
        [Description("Nam")]
        MALE = 0,
        [Description("Nữ")]
        FEMALE = 1,
        [Description("Khác")]
        OTHER = 2
    }

    //public static bool ConvertGenderEnumToBoolean(GenderEnum gender)
    //{
    //    // Giả định: Male = true, Female/Other = false
    //    return gender == GenderEnum.MALE;
    //}
}
