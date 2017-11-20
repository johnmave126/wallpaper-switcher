using System;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Text;


public class Startup
{
    public async Task<object> Invoke(object input)
    {
        return new
        {
            SendMessageTimeout = (Func<object, Task<object>>)(async (dynamic i) =>
            {
                uint lpdwResult;
                uint lr = SendMessageTimeout((IntPtr)i.hwnd, (uint)i.Msg, (IntPtr)i.wParam, (IntPtr)i.lParam, (uint)i.fuFlags, (uint)i.uTimeout, out lpdwResult);
                return new {
                    lpdwResult = lpdwResult,
                    lr = lr
                };
            }),
            FindWindow = (Func<object, Task<object>>)(async (dynamic i) => FindWindow((string)i.lpClassName, (string)i.lpWindowName))
        };
    }

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern uint SendMessageTimeout([In] IntPtr hwnd,
                                                [In] uint Msg,
                                                [In] IntPtr wParam,
                                                [In] IntPtr lParam,
                                                [In] uint fuFlags,
                                                [In] uint uTimeout,
                                                [Out, Optional] out uint lpdwResult);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern uint FindWindow([In, MarshalAs(UnmanagedType.LPTStr)] string lpClassName,
                                           [In, MarshalAs(UnmanagedType.LPTStr)] string lpWindowName);
}
