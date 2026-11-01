try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open('C:\Users\Dell\OneDrive\Desktop\dadlagiin site\DADLAGIIN_TAYLAN_45_HONOG.docx')
    $pages = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    $words = $doc.ComputeStatistics(0) # 0 = wdStatisticWords
    Write-Host "Word App Pages: $pages"
    Write-Host "Word App Words: $words"
    $doc.Close(0)
    $word.Quit()
} catch {
    Write-Host "COM Error: $($_.Exception.Message)"
}
