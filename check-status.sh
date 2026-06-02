#!/bin/bash
echo "========================================="
echo "  PropertiHub 系统状态检查"
echo "========================================="
echo ""

echo "1. Next.js 服务状态..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo "   ✅ Next.js 运行正常 (端口 3000)"
else
    echo "   ❌ Next.js 无响应"
fi
echo ""

echo "2. Caddy 网关状态..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:81/ | grep -q "200"; then
    echo "   ✅ Caddy 运行正常 (端口 81)"
else
    echo "   ❌ Caddy 无响应"
fi
echo ""

echo "3. API 端点状态..."
response=$(curl -s http://localhost:81/api/seed-data 2>&1)
if echo "$response" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null; then
    echo "   ✅ /api/seed-data 正常"
    counts=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'     Properties: {len(data.get(\"properties\", []))}, AdminUsers: {len(data.get(\"adminUsers\", []))}, Visitors: {len(data.get(\"visitors\", []))}')" 2>/dev/null)
    echo "   $counts"
else
    echo "   ❌ /api/seed-data 返回错误"
    echo "   Response: ${response:0:100}..."
fi
echo ""

echo "4. Supabase 连接状态..."
if grep -q "placeholder.supabase.co" /home/z/my-project/src/lib/supabase.ts 2>/dev/null; then
    echo "   ⚠️  Supabase 未配置 (使用 placeholder)"
else
    if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        echo "   ✅ Supabase 环境变量已设置"
    else
        echo "   ⚠️  Supabase 环境变量缺失"
    fi
fi
echo ""

echo "5. 数据库状态..."
if [ -f "/home/z/my-project/db/custom.db" ]; then
    echo "   ✅ SQLite 数据库存在: /home/z/my-project/db/custom.db"
else
    echo "   ⚠️  SQLite 数据库不存在"
fi
echo ""

echo "========================================="
echo "  阿里云函数计算 (FC) 信息"
echo "========================================="
echo "   Function: $FC_FUNCTION_NAME"
echo "   Region: $FC_REGION"
echo "   Instance: $FC_INSTANCE_ID"
echo "   Memory: ${FC_FUNCTION_MEMORY_SIZE}MB"
echo "   Port: $FC_CUSTOM_LISTEN_PORT"
echo ""

echo "========================================="
echo "  建议"
echo "========================================="
echo ""
echo "如果您看到 'PreconditionFailed: function is pending state' 错误："
echo "  • 这通常发生在函数冷启动或重新部署时"
echo "  • 请等待 30-60 秒，然后刷新页面"
echo "  • 如果问题持续，可能需要检查 FC 控制台"
echo ""
echo "数据为空的解决方案："
echo "  选项 A - 使用 SQLite:"
echo "    bun run db:push && bun run prisma/seed"
echo ""
echo "  选项 B - 配置 Supabase:"
echo "    1. 创建 .env.local 文件"
echo "    2. 添加 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
echo "    3. 重启服务"
echo ""
echo "========================================="