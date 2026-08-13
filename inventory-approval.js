(() => {
  const URL='https://khuuazwwxlggsfvvofsu.supabase.co/rest/v1/seafood_inventory';
  const KEY='sb_publishable_Ny50rb2ZsvuwZ_bR9d1uHw_6dxXgTdO';
  const headers={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const previousAccount=window.openAccount;
  window.openAccount=async()=>{
    if(currentUser()!=='admin'){previousAccount();return}
    showModal('<h2>관리자 상품 승인</h2><p>등록 재고를 불러오는 중입니다.</p>');
    try{
      const response=await fetch(URL+'?select=id,seller_name,product_name,quantity,unit,wholesale_price,location,approval_status,created_at&order=created_at.desc',{headers});
      if(!response.ok)throw new Error('inventory load failed');
      const items=await response.json(),pending=items.filter(item=>item.approval_status==='pending'),approved=items.filter(item=>item.approval_status==='approved'),rejected=items.filter(item=>item.approval_status==='rejected');
      const details=item=>`<div><b>${esc(item.product_name)}</b><small>${esc(item.seller_name)} · ${item.quantity}kg · ${esc(item.location)}</small><em>₩ ${Number(item.wholesale_price).toLocaleString()}</em></div>`;
      const deleteButton=item=>`<button class="delete-inventory" onclick="deleteInventory('${item.id}')">상품 삭제</button>`;
      const row=item=>`<article>${details(item)}<div class="approval-actions"><button onclick="approveInventory('${item.id}')">상품 승인</button><button class="reject-inventory" onclick="rejectInventory('${item.id}')">비승인</button>${deleteButton(item)}</div></article>`;
      showModal(`<h2>관리자 상품 관리</h2><p>승인된 재고만 구매자 화면에 공개됩니다.</p><div class="approval-summary"><span>승인 대기 <b>${pending.length}건</b></span><span>판매 중 <b>${approved.length}건</b></span><span>비승인 <b>${rejected.length}건</b></span></div><h3 class="admin-section-title">승인 대기 재고</h3><div class="approval-list">${pending.map(row).join('')||'<p>승인 대기 재고가 없습니다.</p>'}</div><h3 class="admin-section-title">판매 중 재고</h3><div class="approval-list approved">${approved.map(item=>`<article>${details(item)}<div class="approval-actions"><i>승인 완료</i>${deleteButton(item)}</div></article>`).join('')||'<p>판매 중 재고가 없습니다.</p>'}</div><h3 class="admin-section-title">비승인 재고</h3><div class="approval-list rejected">${rejected.map(item=>`<article>${details(item)}<div class="approval-actions"><button onclick="approveInventory('${item.id}')">재승인</button>${deleteButton(item)}</div></article>`).join('')||'<p>비승인 재고가 없습니다.</p>'}</div><button class="logout-button" onclick="logout()">관리자 로그아웃</button>`);
    }catch(error){previousAccount();toast('공유 재고를 불러오지 못했습니다.');}
  };
  window.approveInventory=async id=>{try{const response=await fetch(URL+'?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({approval_status:'approved'})});if(!response.ok)throw new Error('approval failed');toast('상품을 승인했습니다. 구매자 화면에 공개됩니다.');openAccount()}catch(error){toast('상품 승인에 실패했습니다.')}};
  window.rejectInventory=async id=>{try{const response=await fetch(URL+'?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({approval_status:'rejected'})});if(!response.ok)throw new Error('rejection failed');toast('상품을 비승인 처리했습니다. 구매자 화면에는 표시되지 않습니다.');openAccount()}catch(error){toast('비승인 처리에 실패했습니다.')}};
  window.deleteInventory=async id=>{if(!confirm('이 상품을 삭제할까요? 삭제한 상품은 복구할 수 없습니다.'))return;try{const response=await fetch(URL+'?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers});if(!response.ok)throw new Error('delete failed');toast('상품을 삭제했습니다.');openAccount()}catch(error){toast('상품 삭제에 실패했습니다.')}};
})();
