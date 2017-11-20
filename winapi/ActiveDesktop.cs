using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Text;


public class Startup
{
    public async Task<object> Invoke(object input)
    {
        return ActiveDesktopWrapper.Factory();
    }
}

[ComImport]
[Guid("F490EB00-1240-11D1-9888-006097DEACF9")]  
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IActiveDesktop
{
    void ApplyChanges([In, MarshalAs(UnmanagedType.U4)] uint dwFlags);

    void GetWallpaper([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pwszWallpaper,
                      [In, MarshalAs(UnmanagedType.U4)] uint cchWallpaper,
                      [In, MarshalAs(UnmanagedType.U4)] uint dwFlags);

    void SetWallpaper([In, MarshalAs(UnmanagedType.LPWStr)] string pwszWallpaper,
                      [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GetWallpaperOptions([In, Out, MarshalAs(UnmanagedType.LPStruct)] WallpaperOpt pwpo,
                             [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void SetWallpaperOptions([In, MarshalAs(UnmanagedType.LPStruct)] WallpaperOpt pwpo,
                             [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GetPattern([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pwszPattern,
                    [In, MarshalAs(UnmanagedType.U4)] uint cchPattern,
                    [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void SetPattern([In, MarshalAs(UnmanagedType.LPWStr)] string pwszPattern,
                    [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GetDesktopItemOptions([In, Out, MarshalAs(UnmanagedType.LPStruct)] ComponentsOpt pco,
                               [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void SetDesktopItemOptions([In, Out, MarshalAs(UnmanagedType.LPStruct)] ComponentsOpt pco,
                               [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void AddDesktopItem([In, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                        [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void AddDesktopItemWIthUI([In] IntPtr hwnd,
                              [In, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                              [In, MarshalAs(UnmanagedType.U4)] uint dwFlags);

    void ModifyDesktopItem([In, Out, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                           [In, MarshalAs(UnmanagedType.U4)] uint dwFlags);

    void RemoveDesktopItem([In, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                           [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GetDesktopItemCount([Out] out int pcItems,
                             [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GetDesktopItem([In] int nComponent,
                        [In, Out, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                        [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);
    
    void GetDesktopItemByID([In, MarshalAs(UnmanagedType.U8)] ulong dwID,
                            [In, Out, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                            [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void GenerateDesktopItemHtml([In, MarshalAs(UnmanagedType.LPWStr)] string pwszFileName,
                                 [In, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                                 [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);

    void AddUrl([In, Optional] IntPtr hwnd,
                [In, MarshalAs(UnmanagedType.LPWStr)] string pszSource,
                [In, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                [In, MarshalAs(UnmanagedType.U4)] uint dwFlags);

    void GetDesktopItemBySource([In, MarshalAs(UnmanagedType.LPWStr)] string pszSource,
                                [In, Out, MarshalAs(UnmanagedType.LPStruct)] Component pcomp,
                                [MarshalAs(UnmanagedType.U4)] uint dwReserved = 0);
}

[ComImport]
[Guid("75048700-EF1F-11D0-9888-006097DEACF9")]
public class ActiveDesktop
{ }

public class ActiveDesktopWrapper
{
    public static ActiveDesktopWrapper Factory()
    {
        ActiveDesktopWrapper adw = new ActiveDesktopWrapper();
        adw.ApplyChanges = adw.DelegationFactory(0);
        adw.GetWallpaper = adw.DelegationFactory(1);
        adw.SetWallpaper = adw.DelegationFactory(2);
        adw.GetWallpaperOptions = adw.DelegationFactory(3);
        adw.SetWallpaperOptions = adw.DelegationFactory(4);
        adw.GetPattern = adw.DelegationFactory(5);
        adw.SetPattern = adw.DelegationFactory(6);
        adw.GetDesktopItemOptions = adw.DelegationFactory(7);
        adw.SetDesktopItemOptions = adw.DelegationFactory(8);
        adw.AddDesktopItem = adw.DelegationFactory(9);
        adw.AddDesktopItemWithUI = adw.DelegationFactory(10);
        adw.ModifyDesktopItem = adw.DelegationFactory(11);
        adw.RemoveDesktopItem = adw.DelegationFactory(12);
        adw.GetDesktopItemCount = adw.DelegationFactory(13);
        adw.GetDesktopItem = adw.DelegationFactory(14);
        adw.GetDesktopItemByID = adw.DelegationFactory(15);
        adw.GenerateDesktopItemHtml = adw.DelegationFactory(16);
        adw.AddUrl = adw.DelegationFactory(17);
        adw.GetDesktopItemBySource = adw.DelegationFactory(18);
        Thread server = new Thread(new ThreadStart(adw.ProduceThread));
        server.SetApartmentState(ApartmentState.STA);
        server.Start();
        return adw;
    }

    private Func<object, Task<object>> DelegationFactory(int method_idx)
    {
        return async (dynamic input) =>
        {
            Job query = new Job();
            query.method_idx = method_idx;
            query.input = input;
            _queue.Enqueue(query);
            _signal.Set();
            query._signal.Wait();
            if (query.e != null)
            {
                throw query.e;
            }
            return query.retval;
        };
    }

    private string StringDelegate(Action<StringBuilder> f)
    {
        StringBuilder builder = new StringBuilder(260);
        while (true)
        {
            try
            {
                f(builder);
                break;
            }
            catch(COMException e)
            {
                if(e.ErrorCode == unchecked((int)0x8007007A) && builder.Capacity < int.MaxValue / 4)
                {
                    //ERROR_INSUFFICIENT_BUFFER
                    builder.EnsureCapacity(builder.Capacity * 2);
                    continue;
                }
                else
                {
                    throw;
                }
            }
        }
        return builder.ToString();
    }

    private void ProduceThread()
    {
        IActiveDesktop ad = (IActiveDesktop)new ActiveDesktop();
        _signal.Set();
        while (true)
        {
            _signal.WaitOne();

            Job query;
            while (_queue.TryDequeue(out query))
            {
                object retval = null;
                dynamic input = query.input;
                try
                {
                    switch (query.method_idx)
                    {
                        case 0: ad.ApplyChanges((uint)input.dwFlags); break;
                        case 1: retval = StringDelegate((b) => ad.GetWallpaper(b, (uint)b.Capacity, (uint)input.dwFlags)); break;
                        case 2: ad.SetWallpaper((string)input.pwszWallpaper); break;
                        case 3: ad.GetWallpaperOptions((WallpaperOpt)(retval = new WallpaperOpt())); break;
                        case 4: ad.SetWallpaperOptions(new WallpaperOpt((dynamic)input.pwpo)); break;
                        case 5: retval = StringDelegate((b) => ad.GetPattern(b, (uint)b.Capacity)); break;
                        case 6: ad.SetPattern((string)input.pwszPattern); break;
                        case 7: ad.GetDesktopItemOptions((ComponentsOpt)(retval = new ComponentsOpt())); break;
                        case 8: ad.SetDesktopItemOptions(new ComponentsOpt((dynamic)input.pco)); break;
                        case 9: ad.AddDesktopItem(new Component((dynamic)input.pcomp)); break;
                        case 10: ad.AddDesktopItemWIthUI((IntPtr)input.hwnd, new Component((dynamic)input.pcomp), (uint)input.dwFlags); break;
                        case 11: ad.ModifyDesktopItem((Component)(retval = new Component((dynamic)input.pcomp)), (uint)input.dwFlags); break;
                        case 12: ad.RemoveDesktopItem(new Component((dynamic)input.pcomp)); break;
                        case 13: int pcItems; ad.GetDesktopItemCount(out pcItems); retval = pcItems; break;
                        case 14: ad.GetDesktopItem((int)input.nComponent, (Component)(retval = new Component((dynamic)input.pcomp))); break;
                        case 15: ad.GetDesktopItemByID((ulong)input.dwID, (Component)(retval = new Component((dynamic)input.pcomp))); break;
                        case 16: ad.GenerateDesktopItemHtml((string)input.pwszFileName, new Component((dynamic)input.pcomp)); break;
                        case 17: ad.AddUrl((IntPtr)input.hwnd, (string)input.pszSource, new Component((dynamic)input.pcomp), (uint)input.dwFlags); break;
                        case 18: ad.GetDesktopItemBySource((string)input.pszSource, (Component)(retval = new Component((dynamic)input.pcomp))); break;
                    }
                    query.retval = retval;
                }
                catch (Exception e)
                {
                    query.e = e;
                }
                query._signal.Set();
            }
        }

    }
    private readonly AutoResetEvent _signal = new AutoResetEvent(false);
    private readonly ConcurrentQueue<Job> _queue = new ConcurrentQueue<Job>();
    private class Job
    {
        public int method_idx;
        public dynamic input;
        public object retval;
        public Exception e = null;
        public readonly ManualResetEventSlim _signal = new ManualResetEventSlim();
    }

    public Func<object, Task<object>> ApplyChanges;
    public Func<object, Task<object>> GetWallpaper;
    public Func<object, Task<object>> SetWallpaper;
    public Func<object, Task<object>> GetWallpaperOptions;
    public Func<object, Task<object>> SetWallpaperOptions;
    public Func<object, Task<object>> GetPattern;
    public Func<object, Task<object>> SetPattern;
    public Func<object, Task<object>> GetDesktopItemOptions;
    public Func<object, Task<object>> SetDesktopItemOptions;
    public Func<object, Task<object>> AddDesktopItem;
    public Func<object, Task<object>> AddDesktopItemWithUI;
    public Func<object, Task<object>> ModifyDesktopItem;
    public Func<object, Task<object>> RemoveDesktopItem;
    public Func<object, Task<object>> GetDesktopItemCount;
    public Func<object, Task<object>> GetDesktopItem;
    public Func<object, Task<object>> GetDesktopItemByID;
    public Func<object, Task<object>> GenerateDesktopItemHtml;
    public Func<object, Task<object>> AddUrl;
    public Func<object, Task<object>> GetDesktopItemBySource;
}

public class Win32Constnats
{

    public const int MAX_PATH = 260;

    public const int INTERNET_MAX_PATH_LENGTH = 2048;
    public const int INTERNET_MAX_SCHEME_LENGTH = 32;
    private const int SIZEOF_COLONSLASHES = 4; // sizeof("://\0")
    public const int INTERNET_MAX_URL_LENGTH = INTERNET_MAX_SCHEME_LENGTH + SIZEOF_COLONSLASHES + INTERNET_MAX_PATH_LENGTH;
}

[StructLayout(LayoutKind.Sequential)]
public class WallpaperOpt
{
    public readonly uint dwSize = (uint)Marshal.SizeOf(typeof(WallpaperOpt));
    public uint dwStyle;

    public WallpaperOpt() { }
    public WallpaperOpt(dynamic obj)
    {
        dwStyle = (uint)obj.dwStyle;
    }
}

[StructLayout(LayoutKind.Sequential)]
public class ComponentsOpt
{
    public readonly uint dwSize = (uint)Marshal.SizeOf(typeof(ComponentsOpt));
    [MarshalAs(UnmanagedType.Bool)]
    public bool fEnableComponents;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fActiveDesktop;

    public ComponentsOpt() { }
    public ComponentsOpt(dynamic obj)
    {
        fEnableComponents = (bool)obj.fEnableComponents;
        fActiveDesktop = (bool)obj.fActiveDesktop;
    }
}

[StructLayout(LayoutKind.Sequential)]
public struct ComponentPos
{
    public uint dwSize;
    public int iLeft;
    public int iTop;
    public uint dwWidth;
    public uint dwHeight;
    public int iszIndex;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fCanResize;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fCanResizeX;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fCanResizeY;
    public int iPreferredLeftPercent;
    public int iPreferredTopPercent;

    public ComponentPos(dynamic obj)
    {
        dwSize = (uint)Marshal.SizeOf(typeof(ComponentPos));
        iLeft = (int)obj.iLeft;
        iTop = (int)obj.iTop;
        dwWidth = (uint)obj.dwWidth;
        dwHeight = (uint)obj.dwHeight;
        iszIndex = (int)obj.iszIndex;
        fCanResize = (bool)obj.fCanResize;
        fCanResizeX = (bool)obj.fCanResizeX;
        fCanResizeY = (bool)obj.fCanResizeY;
        iPreferredLeftPercent = (int)obj.iPreferredLeftPercent;
        iPreferredTopPercent = (int)obj.iPreferredTopPercent;
    }
}

[StructLayout(LayoutKind.Sequential)]
public struct ComponentStateInfo
{
    public uint dwSize;
    public int iLeft;
    public int iTop;
    public uint dwWidth;
    public uint dwHeight;
    public uint dwItemState;

    public ComponentStateInfo(dynamic obj)
    {
        dwSize = (uint)Marshal.SizeOf(typeof(ComponentStateInfo));
        iLeft = (int)obj.iLeft;
        iTop = (int)obj.iTop;
        dwWidth = (uint)obj.dwWidth;
        dwHeight = (uint)obj.dwHeight;
        dwItemState = (uint)obj.dwItemState;
    }
}

[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
public class Component
{
    public readonly uint dwSize = (uint)Marshal.SizeOf(typeof(Component));
    public readonly uint dwID = 0; //Reserved
    public int iComponentType;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fChecked;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fDirty;
    [MarshalAs(UnmanagedType.Bool)]
    public bool fNoScroll;
    [MarshalAs(UnmanagedType.Struct)]
    public ComponentPos cpPos;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Win32Constnats.MAX_PATH)]
    public string wszFriendlyName;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Win32Constnats.INTERNET_MAX_URL_LENGTH)]
    public string wszSource;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = Win32Constnats.INTERNET_MAX_URL_LENGTH)]
    public string wszSubscribedURL;
    public uint dwCurItemState;
    [MarshalAs(UnmanagedType.Struct)]
    public ComponentStateInfo csiOriginal;
    [MarshalAs(UnmanagedType.Struct)]
    public ComponentStateInfo csiRestored;

    public Component()
    {
        cpPos.dwSize = (uint)Marshal.SizeOf(typeof(ComponentPos));
        csiOriginal.dwSize = (uint)Marshal.SizeOf(typeof(ComponentStateInfo));
        csiRestored.dwSize = (uint)Marshal.SizeOf(typeof(ComponentStateInfo));
    }
    public Component(dynamic obj)
    {
        iComponentType = (int)obj.iComponentType;
        fChecked = (bool)obj.fChecked;
        fDirty = (bool)obj.fDirty;
        fNoScroll = (bool)obj.fNoScroll;
        cpPos = new ComponentPos((dynamic)obj.cpPos);
        wszFriendlyName = (string)obj.wszFriendlyName;
        wszSource = (string)obj.wszSource;
        wszSubscribedURL = (string)obj.wszSubscribedURL;
        dwCurItemState = (uint)obj.dwCurItemState;
        csiOriginal = new ComponentStateInfo((dynamic)obj.csiOriginal);
        csiRestored = new ComponentStateInfo((dynamic)obj.csiRestored);
    }
}

