using System;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Text;


public class Startup
{
    public async Task<object> Invoke(object input)
    {
        return DesktopWallpaperWrapper.Factory();
    }
}

[ComImport]
[Guid("B92B56A9-8B55-4E14-9A89-0199BBB6F93B")]  
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IDesktopWallpaper
{
    void SetWallpaper([In, MarshalAs(UnmanagedType.LPWStr)] string monitorID,
                      [In, MarshalAs(UnmanagedType.LPWStr)] string wallpaper);

    [return: MarshalAs(UnmanagedType.LPWStr)]
    string GetWallpaper([In, MarshalAs(UnmanagedType.LPWStr)] string monitorID);

    [return: MarshalAs(UnmanagedType.LPWStr)]
    string GetMonitorDevicePathAt([In] uint monitorIndex);

    [return: MarshalAs(UnmanagedType.U4)]
    uint GetMonitorDevicePathCount();

    [return: MarshalAs(UnmanagedType.Struct)]
    Rect GetMonitorRECT([In, MarshalAs(UnmanagedType.LPWStr)] string monitorID);

    void SetBackgroundColor([In, MarshalAs(UnmanagedType.U4)] uint color);

    [return: MarshalAs(UnmanagedType.U4)]
    uint GetBackgroundColor();

    void SetPosition([In, MarshalAs(UnmanagedType.I4)] int position);
    
    [return: MarshalAs(UnmanagedType.I4)]
    int GetPosition();

    void SetSlideshow([In] IntPtr items);

    IntPtr GetSlideshow();

    void SetSlideshowOptions([In, MarshalAs(UnmanagedType.I4)] int options,
                             [In, MarshalAs(UnmanagedType.U4)] uint slideshowTick);

    [PreserveSig]
    uint GetSlideshowOptions([Out, MarshalAs(UnmanagedType.I4)] out int options,
                             [Out, MarshalAs(UnmanagedType.U4)] out uint slideshowTick);

    void AdvanceSlideshow([In, MarshalAs(UnmanagedType.LPWStr)] string monitorID,
                          [In, MarshalAs(UnmanagedType.I4)] int direction);
    
    int GetStatus();

    void Enable([In] bool enable);
}

[ComImport]
[Guid("C2CF3110-460E-4FC1-B9D0-8A1C0C9CC4BD")]
public class DesktopWallpaper
{ }

public class DesktopWallpaperWrapper
{
    public static DesktopWallpaperWrapper Factory()
    {
        IDesktopWallpaper dw = (IDesktopWallpaper)new DesktopWallpaper();
        DesktopWallpaperWrapper dww = new DesktopWallpaperWrapper();
        dww.SetWallpaper = (async (dynamic input) =>
        {
            dw.SetWallpaper((string)input.monitorID, (string)input.wallpaper);
            return null;
        });
        dww.GetWallpaper = (async (dynamic input) => dw.GetWallpaper((string)input.monitorID));
        dww.GetMonitorDevicePathAt = (async (dynamic input) => dw.GetMonitorDevicePathAt((uint)input.monitorIndex));
        dww.GetMonitorDevicePathCount = (async (dynamic input) => dw.GetMonitorDevicePathCount());
        dww.GetMonitorRECT = (async (dynamic input) => dw.GetMonitorRECT((string)input.monitorID));
        dww.SetBackgroundColor = (async (dynamic input) =>
        {
            dw.SetBackgroundColor((uint)input.color);
            return null;
        });
        dww.GetBackgroundColor = (async (dynamic input) => dw.GetBackgroundColor());
        dww.SetPosition = (async (dynamic input) =>
        {
            dw.SetPosition((int)input.position);
            return null;
        });
        dww.GetPosition = (async (dynamic input) => dw.GetPosition());
        /*
         * dww.SetSlideshow
         * dww.GetSlideshow
         * Not supported
         */
        dww.SetSlideshow = (async (dynamic input) => {
            throw new NotSupportedException("SetSlideshow Not Supported");
        });
        dww.GetSlideshow = (async (dynamic input) => {
            throw new NotSupportedException("GetSlideshow Not Supported");
        });
        dww.SetSlideshowOptions = (async (dynamic input) =>
        {
            dw.SetSlideshowOptions((int)input.options, (uint)input.slideshowTick);
            return null;
        });
        dww.GetSlideshowOptions = (async (dynamic input) =>
        {
            int options;
            uint slideshowTick;
            uint retval = dw.GetSlideshowOptions(out options, out slideshowTick);
            if(retval != 0)
            {
                throw new Exception("Invoking GetSlideshowOptions failed");
            }
            return new { options = options, slideshowTick = slideshowTick };
        });
        dww.AdvanceSlideshow = (async (dynamic input) =>
        {
            dw.AdvanceSlideshow((string)input.monitorID, (int)input.direction);
            return null;
        });
        dww.GetStatus = (async (dynamic input) => dw.GetStatus());
        dww.Enable = (async (dynamic input) =>
        {
            dw.Enable((bool)input.enable);
            return null;
        });
        return dww;
    }
    public Func<object, Task<object>> SetWallpaper;
    public Func<object, Task<object>> GetWallpaper;
    public Func<object, Task<object>> GetMonitorDevicePathAt;
    public Func<object, Task<object>> GetMonitorDevicePathCount;
    public Func<object, Task<object>> GetMonitorRECT;
    public Func<object, Task<object>> SetBackgroundColor;
    public Func<object, Task<object>> GetBackgroundColor;
    public Func<object, Task<object>> SetPosition;
    public Func<object, Task<object>> GetPosition;
    public Func<object, Task<object>> SetSlideshow;
    public Func<object, Task<object>> GetSlideshow;
    public Func<object, Task<object>> SetSlideshowOptions;
    public Func<object, Task<object>> GetSlideshowOptions;
    public Func<object, Task<object>> AdvanceSlideshow;
    public Func<object, Task<object>> GetStatus;
    public Func<object, Task<object>> Enable;
}

[StructLayout(LayoutKind.Sequential)]
public struct Rect
{
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}
