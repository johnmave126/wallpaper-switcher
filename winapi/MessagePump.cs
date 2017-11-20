using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;


public class Startup
{
    public async Task<object> Invoke(object input)
    {
        HiddenForm pumper = new HiddenForm();
        Thread pumpThread = new Thread(delegate ()
        {
            Application.Run(pumper);
        });

        pumpThread.SetApartmentState(ApartmentState.STA);
        pumpThread.Start();
        return new
        {
            subscribe = (Func<object, Task<object>>)(async (i) => { pumper.Subscribe((Func<object, Task<object>>)i); return null; })
        };
    }
}

public class HiddenForm: Form
{
    private static int WM_DISPLAYCHANGE = 0x07E;
    private object _lock = new object();
    private List<Func<object, Task<object>>> listeners = new List<Func<object, Task<object>>>();

    protected override void OnLoad(EventArgs e)
    {
        Visible = false;
        ShowInTaskbar = false;
        base.OnLoad(e);
    }

    protected override void WndProc(ref Message m)
    {
        if(m.Msg == WM_DISPLAYCHANGE)
        {
            lock(_lock)
            {
                foreach(Func<object, Task<object>> f in listeners)
                {
                    f(null).ContinueWith(x => { }, TaskContinuationOptions.OnlyOnFaulted);
                }
            }
        }
        base.WndProc(ref m);
    }

    public void Subscribe(Func<object, Task<object>> f)
    {
        lock(_lock)
        {
            listeners.Add(f);
        }
    }
}