import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, createPagination } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    const techSlug = searchParams.get('tech');

    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (techSlug) {
      where.companyTechs = {
        some: {
          tech: {
            slug: techSlug
          }
        }
      };
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        include: {
          companyTechs: {
            include: {
              tech: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logoUrl: true,
                  color: true
                }
              }
            }
          }
        }
      }),
      prisma.company.count({ where })
    ]);

    const formattedCompanies = companies.map(company => ({
      ...company,
      id: company.id.toString(),
      techSlugs: company.companyTechs.map(ct => ct.tech.slug),
      techs: company.companyTechs.map(ct => ({
        ...ct.tech,
        id: ct.tech.id.toString()
      }))
    }));

    // companyTechs 속성을 응답에서 제거
    const result = formattedCompanies.map(({ companyTechs, ...rest }) => rest);

    const pagination = createPagination(page, limit, total);

    return successResponse(result, 200, pagination);
  } catch (error) {
    console.error('회사 목록 조회 오류:', error);
    return errorResponse('서버 오류가 발생했습니다.', 500);
  }
}


