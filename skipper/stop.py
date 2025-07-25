#!/usr/bin/env python3
"""
Script para parar os serviços do Skipper
"""

import os
import sys
import subprocess
import signal
import psutil
from pathlib import Path

def find_processes_by_port(port):
    """Encontra processos usando uma porta específica"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'connections']):
        try:
            for conn in proc.info['connections']:
                if conn.laddr.port == port:
                    processes.append(proc)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return processes

def kill_processes_by_name(name_patterns):
    """Mata processos por nome"""
    killed = []
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            proc_name = proc.info['name'].lower()
            for pattern in name_patterns:
                if pattern.lower() in proc_name:
                    proc.kill()
                    killed.append(proc.info['pid'])
                    print(f"🛑 Processo {proc_name} (PID: {proc.info['pid']}) finalizado")
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return killed

def main():
    print("🛑 Parando serviços do Skipper...")
    
    # Parar processos nas portas do Skipper
    ports_to_check = [8000, 3000]  # Backend e Frontend
    
    for port in ports_to_check:
        processes = find_processes_by_port(port)
        if processes:
            print(f"🔍 Encontrados {len(processes)} processos na porta {port}")
            for proc in processes:
                try:
                    proc.terminate()
                    print(f"🛑 Processo {proc.name()} (PID: {proc.pid}) finalizado")
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
        else:
            print(f"✅ Nenhum processo encontrado na porta {port}")
    
    # Parar processos por nome
    process_patterns = ['uvicorn', 'node', 'npm', 'vite']
    killed = kill_processes_by_name(process_patterns)
    
    if killed:
        print(f"✅ {len(killed)} processos finalizados")
    else:
        print("✅ Nenhum processo do Skipper encontrado")
    
    print("🎉 Serviços do Skipper parados com sucesso!")

if __name__ == "__main__":
    main() 