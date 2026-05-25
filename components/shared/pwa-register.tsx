"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { trackEvent } from "@/lib/analytics";

export function PwaRegister() {
  useEffect(() => {
    window.addEventListener("appinstalled", () => {
      trackEvent("pwa_install_click");
    });

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Listen for updates: when a new SW is found and waiting
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // A new version is ready — prompt the user to reload
              toast(
                (t) => (
                  <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13 }}>
                    Versi baru tersedia.{" "}
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        window.location.reload();
                      }}
                      style={{
                        background: "none", border: "none", color: "oklch(0.78 0.13 155)",
                        cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      Muat ulang
                    </button>
                  </span>
                ),
                { duration: 30000, icon: "🔄" }
              );
            }
          });
        });
      })
      .catch(() => {});

    // Reload once when a new SW takes control — guard against loop
    let reloadTriggered = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloadTriggered) {
        reloadTriggered = true;
        window.location.reload();
      }
    });
  }, []);

  return null;
}
